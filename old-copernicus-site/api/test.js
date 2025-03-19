module.exports = (req, res) => {
    res.status(200).json({
      message: 'API is working!',
      env: {
        hasClientId: !!process.env.SPOTIFY_CLIENT_ID,
        hasClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
        hasShowId: !!process.env.SPOTIFY_SHOW_ID
      }
    });
  };