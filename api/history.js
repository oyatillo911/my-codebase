import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Avtomatik ravishda jadval yaratish (agar mavjud bo'lmasa)
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS history (
        id SERIAL PRIMARY KEY,
        code TEXT NOT NULL,
        analysis JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  // 1. Tarixni o'qib olish (GET)
  if (req.method === 'GET') {
    try {
      const { rows } = await sql`SELECT * FROM history ORDER BY created_at DESC LIMIT 20;`;
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // 2. Yangi tahlilni saqlash (POST)
  if (req.method === 'POST') {
    try {
      const { code, analysis } = req.body;
      await sql`
        INSERT INTO history (code, analysis)
        VALUES (${code}, ${JSON.stringify(analysis)});
      `;
      return res.status(200).json({ message: 'Muvaffaqiyatli saqlandi!' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // 3. Tarixni tozalash (DELETE)
  if (req.method === 'DELETE') {
    try {
      await sql`DELETE FROM history;`;
      return res.status(200).json({ message: 'Tarix tozalandi' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}