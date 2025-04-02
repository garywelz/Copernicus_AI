#!/usr/bin/env python3
import os
import sys
import shutil
import datetime
import pkg_resources
import subprocess
from typing import Dict, List, Tuple, Optional
from pathlib import Path

from service_validator import ServiceValidator
from huggingface_config import HuggingFaceConfig

class DeploymentManager:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.requirements_dir = self.project_root / "requirements"
        self.backup_dir = self.project_root / "backups"
        self.env_type = os.getenv("DEPLOYMENT_ENV", "production")
        self.service_validator = ServiceValidator()
        self.huggingface_config = HuggingFaceConfig()
        self.current_backup: Optional[str] = None
        
    def create_backup(self) -> bool:
        """Create a backup of the current state."""
        try:
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = self.backup_dir / timestamp
            
            # Create backup directory
            self.backup_dir.mkdir(exist_ok=True)
            
            # Backup source code and configs
            shutil.copytree(
                self.project_root / "src",
                backup_path / "src",
                ignore=shutil.ignore_patterns('*.pyc', '__pycache__', 'node_modules')
            )
            
            # Backup requirements
            shutil.copytree(
                self.requirements_dir,
                backup_path / "requirements"
            )
            
            # Save environment info
            with open(backup_path / "environment.txt", "w") as f:
                f.write(f"Deployment Environment: {self.env_type}\n")
                f.write(f"Python Version: {sys.version}\n")
                f.write(f"Timestamp: {timestamp}\n")
                
            self.current_backup = timestamp
            print(f"✓ Backup created: {timestamp}")
            return True
        except Exception as e:
            print(f"❌ Backup creation failed: {e}")
            return False
            
    def rollback(self, backup_id: Optional[str] = None) -> bool:
        """Rollback to a previous backup."""
        try:
            # Use most recent backup if none specified
            if not backup_id:
                backups = sorted(self.backup_dir.glob("*"))
                if not backups:
                    print("❌ No backups available")
                    return False
                backup_path = backups[-1]
            else:
                backup_path = self.backup_dir / backup_id
                
            if not backup_path.exists():
                print(f"❌ Backup {backup_id} not found")
                return False
                
            # Restore source code and configs
            shutil.rmtree(self.project_root / "src", ignore_errors=True)
            shutil.copytree(backup_path / "src", self.project_root / "src")
            
            # Restore requirements
            shutil.rmtree(self.requirements_dir, ignore_errors=True)
            shutil.copytree(backup_path / "requirements", self.requirements_dir)
            
            print(f"✓ Rolled back to: {backup_path.name}")
            return True
        except Exception as e:
            print(f"❌ Rollback failed: {e}")
            return False
            
    def check_python_version(self) -> bool:
        """Check if Python version meets requirements."""
        min_version = (3, 8)
        current = sys.version_info[:2]
        
        if current < min_version:
            print(f"❌ Error: Python {min_version[0]}.{min_version[1]} or higher required")
            return False
        return True
        
    def get_requirements(self) -> List[str]:
        """Get appropriate requirements based on environment."""
        if self.env_type == "development":
            req_file = self.requirements_dir / "development.txt"
        else:
            req_file = self.requirements_dir / "production.txt"
            
        if not req_file.exists():
            print(f"❌ Error: Requirements file {req_file} not found")
            sys.exit(1)
            
        return req_file.read_text().splitlines()
        
    def check_compatibility(self) -> List[Tuple[str, str, str]]:
        """Check version compatibility of installed packages."""
        conflicts = []
        requirements = self.get_requirements()
        
        for req in requirements:
            if req.startswith("#") or req.startswith("-r") or not req.strip():
                continue
                
            try:
                req_name = req.split(">=")[0].split("==")[0].strip()
                req_version = req.split(">=")[-1].split("==")[-1].strip()
                
                try:
                    installed = pkg_resources.get_distribution(req_name)
                    if installed.version < req_version:
                        conflicts.append((req_name, installed.version, req_version))
                except pkg_resources.DistributionNotFound:
                    conflicts.append((req_name, "not installed", req_version))
                    
            except IndexError:
                continue
                
        return conflicts
        
    def install_requirements(self) -> bool:
        """Install required packages."""
        try:
            subprocess.check_call([
                sys.executable, "-m", "pip", "install",
                "-r", str(self.requirements_dir / f"{self.env_type}.txt")
            ])
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ Error installing requirements: {e}")
            return False
            
    def setup_huggingface_cache(self) -> bool:
        """Setup Hugging Face cache directory."""
        cache_dir = os.getenv("TRANSFORMERS_CACHE", "~/.cache/huggingface")
        cache_dir = os.path.expanduser(cache_dir)
        
        try:
            os.makedirs(cache_dir, exist_ok=True)
            return True
        except Exception as e:
            print(f"❌ Error setting up cache directory: {e}")
            return False
            
    def verify_gpu_support(self) -> bool:
        """Verify GPU support if available."""
        try:
            import torch
            has_cuda = torch.cuda.is_available()
            if has_cuda:
                print(f"✓ GPU support available: {torch.cuda.get_device_name(0)}")
            else:
                print("⚠️ Warning: No GPU support detected")
            return True
        except ImportError:
            print("⚠️ Warning: Could not verify GPU support")
            return False
            
    def deploy(self) -> bool:
        """Run the deployment process."""
        print(f"\n🚀 Starting deployment in {self.env_type} environment...\n")
        
        # Create backup
        if not self.create_backup():
            return False
            
        # Check Python version
        if not self.check_python_version():
            return False
            
        # Validate services
        print("\n🔍 Validating services...")
        service_status = self.service_validator.validate_all()
        if not all(service_status.values()):
            print("\n⚠️ Some services failed validation. Continue? (y/n)")
            if input().lower() != 'y':
                self.rollback(self.current_backup)
                return False
                
        # Check package compatibility
        conflicts = self.check_compatibility()
        if conflicts:
            print("\n⚠️ Package conflicts found:")
            for pkg, current, required in conflicts:
                print(f"- {pkg}: {current} installed, {required} required")
                
        # Install requirements
        print("\n📦 Installing requirements...")
        if not self.install_requirements():
            self.rollback(self.current_backup)
            return False
            
        # Setup Hugging Face configuration if needed
        if self.env_type == "production":
            print("\n⚙️ Configuring Hugging Face deployment...")
            if not self.huggingface_config.configure():
                self.rollback(self.current_backup)
                return False
                
        # Setup cache
        print("\n📁 Setting up Hugging Face cache...")
        if not self.setup_huggingface_cache():
            self.rollback(self.current_backup)
            return False
            
        # Verify GPU support
        print("\n🖥️ Verifying GPU support...")
        self.verify_gpu_support()
        
        print("\n✨ Deployment completed successfully!")
        return True

def main():
    manager = DeploymentManager()
    success = manager.deploy()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 