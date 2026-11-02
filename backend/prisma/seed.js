const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱...Ejecutando carga inicial de datos (seeds)...');
    
    const salt = await bcrypt.genSalt(10);
    const passwordAdminHash = await bcrypt.hash('Admin123', salt);
    const passwordProfeHash = await bcrypt.hash('Profe123', salt);

    const admin = await prisma.usuario.upsert({
        where: {email: 'admin@progressclub.com'},
        update: {}, 
        create: {
            nombre: 'Administrador General', 
            email: 'admin@progressclub.com', 
            passwordHash: passwordAdminHash, 
            rol: 'ADMIN', 
            activo: true
        }
    });

    const profesor = await prisma.usuario.upsert({
        where: {email: 'profesor@progressclub.com'}, 
        update: {},
        create: {
            nombre: 'Profesor', 
            email: 'profesor@progressclub.com',
            passwordHash: passwordProfeHash,
            rol: 'PROFESOR',
            activo: true
        }
    });
    
    console.log('✅ Seed completado con éxito:');
    console.log(`- Administrador: ${admin.email} (Rol: ${admin.rol})`);
    console.log(`- Profesor: ${profesor.email} (Rol: ${profesor.rol})`);
}

main()
    .catch((error)=>{
        console.error('❌ Error ejecutando el seed:', error);
        process.exit(1);
    })
    .finally(async ()=>{
        await prisma.$disconnect();
    });
