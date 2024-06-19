const router = require('express').Router();
const db = require('./db');

router
  .route('/inventory')
  .get(async (req, res) => {
    try {
      const [items] = await db.query('SELECT * FROM inventory');
      res.json(items);
    } catch (err) {
      res.status(500).send('Server error');
    }
  })
  .post(async (req, res) => {
    const { name, image, description, price, quantity } = req.body;
    try {
      await db.query(
        'INSERT INTO inventory (name, image, description, price, quantity) VALUES (?, ?, ?, ?, ?)',
        [name, image, description, price, quantity]
      );
      res.status(204).end();
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

router
  .route('/inventory/:id')
  .get(async (req, res) => {
    try {
      const [item] = await db.query('SELECT * FROM inventory WHERE id = ?', [req.params.id]);
      if (item.length === 0) {
        return res.status(404).send('Item not found');
      }
      res.json(item[0]);
    } catch (err) {
      res.status(500).send('Server error');
    }
  })
  .put(async (req, res) => {
    const { name, image, description, price, quantity } = req.body;
    try {
      const [result] = await db.query(
        'UPDATE inventory SET name = ?, image = ?, description = ?, price = ?, quantity = ? WHERE id = ?',
        [name, image, description, price, quantity, req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).send('Item not found');
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).send('Server error');
    }
  })
  .delete(async (req, res) => {
    try {
      const [result] = await db.query('DELETE FROM inventory WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) {
        return res.status(404).send('Item not found');
      }
      res.status(204).end();
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

module.exports = router;
