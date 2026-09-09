import { Router } from 'express';
import getDb from '../db/connection.js';

const router = Router();

// GET /api/team — all team members
router.get('/', (req, res) => {
  const db = getDb();
  const members = db.prepare('SELECT * FROM team_members ORDER BY id').all();
  res.json(members);
});

// GET /api/team/workload — per-member open task counts by priority, weighted overload score
router.get('/workload', (req, res) => {
  const db = getDb();
  const members = db.prepare('SELECT * FROM team_members ORDER BY id').all();
  const openTasks = db.prepare("SELECT assignee_id, priority FROM tasks WHERE status != 'done'").all();

  const weights = { urgent: 3, high: 2, medium: 1, low: 0.5 };

  const workload = members.map((member) => {
    const memberTasks = openTasks.filter((t) => t.assignee_id === member.id);
    const counts = { urgent: 0, high: 0, medium: 0, low: 0 };
    let score = 0;
    memberTasks.forEach((t) => {
      counts[t.priority] = (counts[t.priority] || 0) + 1;
      score += weights[t.priority] || 0;
    });

    return {
      id: member.id,
      name: member.name,
      role: member.role,
      avatar_color: member.avatar_color,
      counts,
      totalOpen: memberTasks.length,
      score,
    };
  });

  const average = workload.reduce((sum, m) => sum + m.score, 0) / (workload.length || 1);
  const threshold = average * 2;

  const result = workload.map((m) => ({ ...m, overloaded: m.score > threshold }));

  res.json(result);
});

// GET /api/team/:id — single team member
router.get('/:id', (req, res) => {
  const db = getDb();
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Team member not found' });
  }
  res.json(member);
});

// GET /api/team/:id/tasks — tasks assigned to a team member
router.get('/:id/tasks', (req, res) => {
  const db = getDb();
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Team member not found' });
  }
  const tasks = db.prepare(`
    SELECT t.*, p.name as project_name
    FROM tasks t
    LEFT JOIN projects p ON t.project_id = p.id
    WHERE t.assignee_id = ?
    ORDER BY t.due_date ASC
  `).all(req.params.id);
  res.json(tasks);
});

export default router;
