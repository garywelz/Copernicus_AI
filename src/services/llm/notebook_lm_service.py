from typing import Dict, List, Optional
import os
from google.cloud import aiplatform
from google.cloud.aiplatform import NotebookLM

class NotebookLMService:
    """Service for interacting with Google's Notebook LM"""
    
    def __init__(self, project_id: str, location: str = "us-central1"):
        self.project_id = project_id
        self.location = location
        aiplatform.init(project=project_id, location=location)
        self.client = NotebookLM()

    async def create_scientific_script(
        self,
        topic: str,
        research_papers: List[Dict],
        outline: Optional[Dict] = None
    ) -> Dict:
        """
        Creates a scientific podcast script with proper citations.
        
        Args:
            topic: Main topic of the podcast
            research_papers: List of research papers with metadata
            outline: Optional structured outline for the podcast
            
        Returns:
            Dict containing script sections and citations
        """
        # Create a new notebook
        notebook = await self._create_notebook(topic)
        
        # Add research papers as context
        await self._add_research_context(notebook, research_papers)
        
        # Generate script with citations
        script = await self._generate_script(notebook, outline)
        
        return script

    async def _create_notebook(self, topic: str) -> str:
        """Creates a new notebook for the topic"""
        notebook = self.client.create_notebook(
            display_name=f"Podcast: {topic}",
            description=f"Scientific podcast script about {topic}"
        )
        return notebook.name

    async def _add_research_context(
        self,
        notebook: str,
        papers: List[Dict]
    ) -> None:
        """Adds research papers as context to the notebook"""
        for paper in papers:
            self.client.add_context(
                notebook=notebook,
                content=paper["content"],
                metadata={
                    "title": paper["title"],
                    "authors": paper["authors"],
                    "year": paper["year"],
                    "doi": paper.get("doi", ""),
                    "url": paper.get("url", "")
                }
            )

    async def _generate_script(
        self,
        notebook: str,
        outline: Optional[Dict] = None
    ) -> Dict:
        """Generates the podcast script with citations"""
        script_sections = []
        citations = []
        
        # Use outline if provided, otherwise generate structure
        sections = outline["sections"] if outline else await self._generate_outline(notebook)
        
        for section in sections:
            # Generate content for each section
            response = self.client.generate_content(
                notebook=notebook,
                prompt=self._create_section_prompt(section),
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.8,
                    "top_k": 40,
                    "max_output_tokens": 1024
                }
            )
            
            script_sections.append({
                "title": section["title"],
                "content": response.text,
                "citations": response.citations
            })
            
            # Track citations
            citations.extend(response.citations)
        
        return {
            "sections": script_sections,
            "citations": self._format_citations(citations)
        }

    async def _generate_outline(self, notebook: str) -> List[Dict]:
        """Generates a structured outline for the podcast"""
        response = self.client.generate_content(
            notebook=notebook,
            prompt="Generate a structured outline for a scientific podcast "
                  "covering the main topics and findings from the provided research."
        )
        
        # Parse and structure the outline
        return self._parse_outline(response.text)

    def _create_section_prompt(self, section: Dict) -> str:
        """Creates a prompt for generating section content"""
        return (
            f"Generate engaging podcast dialogue for the section: {section['title']}\n"
            f"Include relevant scientific details and cite sources appropriately.\n"
            f"Make it conversational but maintain scientific accuracy."
        )

    def _format_citations(self, citations: List[Dict]) -> List[Dict]:
        """Formats citations in a consistent structure"""
        formatted = []
        for citation in citations:
            formatted.append({
                "text": citation["text"],
                "source": {
                    "title": citation["source"]["title"],
                    "authors": citation["source"]["authors"],
                    "year": citation["source"]["year"],
                    "doi": citation["source"].get("doi", ""),
                    "url": citation["source"].get("url", "")
                },
                "context": citation.get("context", ""),
                "page_number": citation.get("page_number")
            })
        return formatted

    def _parse_outline(self, outline_text: str) -> List[Dict]:
        """Parses generated outline into structured format"""
        # Basic parsing - enhance based on actual output format
        sections = []
        current_section = None
        
        for line in outline_text.split("\n"):
            line = line.strip()
            if not line:
                continue
                
            if line.startswith("#"):
                if current_section:
                    sections.append(current_section)
                current_section = {
                    "title": line.lstrip("#").strip(),
                    "subsections": []
                }
            elif current_section:
                current_section["subsections"].append(line)
                
        if current_section:
            sections.append(current_section)
            
        return sections 