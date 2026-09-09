import ProjectCard from './ProjectCard';

// BUG: minmax(300px, 2fr) should be minmax(300px, 1fr) — causes layout issues at medium widths
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 2fr))',
  gap: 'var(--space-4)',
};

export default function ProjectList({ projects }) {
  if (!projects?.length) {
    return (
      <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-8)' }}>
        No projects yet — create your first one to get started
      </p>
    );
  }

  return (
    <div style={gridStyle}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
