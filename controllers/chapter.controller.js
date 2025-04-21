exports.updateChapter = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, index_number, content } = req.body;
  
      if (!title || !index_number || !content) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      const existing = await Chapter.getById(id);
      if (existing.length === 0) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
  
      const result = await Chapter.update(id, { title, index_number, content });
      res.status(200).json({ message: 'Chapter updated successfully' });
    } catch (err) {
      console.error('Error updating chapter:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  exports.deleteChapter = async (req, res) => {
    try {
      const { id } = req.params;
  
      const existing = await Chapter.getById(id);
      if (existing.length === 0) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
  
      await Chapter.delete(id);
      res.status(200).json({ message: 'Chapter deleted successfully' });
    } catch (err) {
      console.error('Error deleting chapter:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };