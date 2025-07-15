-- Esquema de base de datos para PostgreSQL
-- Ejecuta este script en tu base de datos PostgreSQL

-- Crear tabla de trabajos
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500) NOT NULL,
    video VARCHAR(500),
    link VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de contactos
CREATE TABLE IF NOT EXISTS contact_submissions (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'rejected', 'unread')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Crear función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar automáticamente updated_at
CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON jobs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at 
    BEFORE UPDATE ON contact_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos datos de ejemplo (opcional)
INSERT INTO jobs (id, title, description, image, link, category) VALUES
('1', 'Sitio Web E-commerce', 'Desarrollo completo de una tienda online con React y Node.js', '/placeholder.jpg', 'https://ejemplo.com', 'Desarrollo Web'),
('2', 'Campaña de Marketing Digital', 'Estrategia integral de marketing digital para empresa de tecnología', '/placeholder.jpg', 'https://ejemplo.com', 'Marketing Digital'),
('3', 'Video Corporativo', 'Producción de video institucional para presentación de empresa', '/placeholder.jpg', 'https://ejemplo.com', 'Producción Audiovisual')
ON CONFLICT (id) DO NOTHING;

-- Comentarios sobre la estructura
COMMENT ON TABLE jobs IS 'Tabla para almacenar los trabajos del portafolio';
COMMENT ON TABLE contact_submissions IS 'Tabla para almacenar los formularios de contacto';
COMMENT ON COLUMN jobs.id IS 'Identificador único del trabajo';
COMMENT ON COLUMN jobs.title IS 'Título del trabajo';
COMMENT ON COLUMN jobs.description IS 'Descripción detallada del trabajo';
COMMENT ON COLUMN jobs.image IS 'URL de la imagen del trabajo';
COMMENT ON COLUMN jobs.video IS 'URL del video del trabajo (opcional)';
COMMENT ON COLUMN jobs.link IS 'Enlace al trabajo o proyecto';
COMMENT ON COLUMN jobs.category IS 'Categoría del trabajo';
COMMENT ON COLUMN contact_submissions.status IS 'Estado del contacto: pending, contacted, completed, rejected, unread'; 