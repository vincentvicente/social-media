const express = require('express');
const { Status } = require('../models');
const authMiddleware = require('../authMiddleware');
const router = express.Router();

// 创建状态（需要登录）
router.post('/', authMiddleware, async (req, res) => {
  const { content } = req.body;
  try {
    const newStatus = new Status({ userId: req.user.userId, content }); // Use req.user.userId
    await newStatus.save();
    res.status(201).json({ message: 'Status created successfully', newStatus });
  } catch (error) {
    console.error('Error creating status:', error);
    res.status(500).json({ error: 'Error creating status', details: error.message });
  }
});

// 获取所有状态（无需登录）
router.get('/', async (req, res) => {
  try {
    const statuses = await Status.find().sort({ createdAt: -1 }).populate('userId', 'username');
    res.status(200).json(statuses);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching statuses' });
  }
});

// 编辑状态更新
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const status = await Status.findById(id);
    if (!status) return res.status(404).json({ error: 'Status not found' });

    // 验证是否为该状态的发布者
    if (status.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'You do not have permission to edit this status' });
    }

    status.content = content;
    await status.save();

    res.status(200).json({ message: 'Status updated successfully', status });
  } catch (error) {
    res.status(500).json({ error: 'Error updating status' });
  }
});

// 删除状态更新
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const status = await Status.findById(id);
    if (!status) return res.status(404).json({ error: 'Status not found' });

    // 验证是否为该状态的发布者
    if (status.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'You do not have permission to delete this status' });
    }

    await status.deleteOne();
    res.status(200).json({ message: 'Status deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting status' });
  }
});

// 点赞/取消点赞状态
router.post('/:id/like', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const status = await Status.findById(id);
    if (!status) return res.status(404).json({ error: 'Status not found' });

    const likeIndex = status.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      // 添加点赞
      status.likes.push(userId);
      status.likesCount += 1;
    } else {
      // 取消点赞
      status.likes.splice(likeIndex, 1);
      status.likesCount -= 1;
    }

    await status.save();
    res.status(200).json({ 
      message: likeIndex === -1 ? 'Status liked' : 'Status unliked',
      likesCount: status.likesCount,
      likes: status.likes
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Error toggling like' });
  }
});

module.exports = router;
