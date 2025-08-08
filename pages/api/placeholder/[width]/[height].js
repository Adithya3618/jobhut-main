export default function handler(req, res) {
    const { width, height } = req.query;
  
    // Validate input
    if (!width || !height || isNaN(width) || isNaN(height)) {
      return res.status(400).json({ error: 'Invalid dimensions' });
    }
  
    res.status(200).json({
      message: `Placeholder image with dimensions ${width}x${height}`,
    });
  }
  