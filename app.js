const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PORT = 3000;

app.use(express.json());

// Route untuk create Todo
app.post('/api/todos', async (req, res) => {
  try {
    // Ambil data input dari body request
    const { title, description, userId } = req.body;

    // Cek apakah user dengan userId sudah ada di database
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    // Jika user tidak ditemukan, beri response error
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Buat Todo baru di database
    const newTodo = await prisma.todo.create({
      data: {
        title,
        description,
        user: { connect: { id: parseInt(userId) } },
      },
    });

    res.json({ message: 'Todo created successfully', todo: newTodo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Jalankan server pada port yang telah ditentukan
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
