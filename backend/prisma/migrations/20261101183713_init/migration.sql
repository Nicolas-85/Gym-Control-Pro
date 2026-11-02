-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('ADMIN', 'PROFESOR');

-- CreateEnum
CREATE TYPE "EstadoSocio" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "EstadoCuota" AS ENUM ('VIGENTE', 'VENCIDO', 'PROXIMO_A_VENCER');

-- CreateEnum
CREATE TYPE "MedioPago" AS ENUM ('FISICO', 'DIGITAL');

-- CreateEnum
CREATE TYPE "FrecuenciaPago" AS ENUM ('DIARIO', 'SEMANAL', 'QUINCENAL', 'MENSUAL');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('VALIDO', 'ANULADO');

-- CreateEnum
CREATE TYPE "TipoMovimientoCaja" AS ENUM ('INGRESO', 'EGRESO', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "OrigenDinero" AS ENUM ('CAJA_OPERATIVA', 'EFECTIVO_GUARDADO', 'DIGITAL');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" "RolUsuario" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socios" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "fecha_alta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoSocio" NOT NULL DEFAULT 'ACTIVO',
    "apto_fecha_presentacion" TIMESTAMP(3),
    "apto_fecha_vencimiento" TIMESTAMP(3),
    "fecha_vencimiento_cuota" TIMESTAMP(3),
    "ultima_frecuencia_pago" "FrecuenciaPago",
    "creado_por_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "socios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingresos" (
    "id" SERIAL NOT NULL,
    "socio_id" INTEGER NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_id" INTEGER NOT NULL,
    "estado_socio_al_ingresar" "EstadoSocio" NOT NULL,
    "estado_cuota_al_ingresar" "EstadoCuota" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingresos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" SERIAL NOT NULL,
    "socio_id" INTEGER NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL,
    "monto" INTEGER NOT NULL,
    "medio_pago" "MedioPago" NOT NULL,
    "frecuencia" "FrecuenciaPago" NOT NULL,
    "fecha_vencimiento_generada" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoPago" NOT NULL DEFAULT 'VALIDO',
    "numero_comprobante" TEXT NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_caja" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoMovimientoCaja" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(10,2) NOT NULL,
    "medio_pago" "MedioPago",
    "concepto" TEXT NOT NULL,
    "categoria" TEXT,
    "origen" "OrigenDinero" NOT NULL,
    "destino" "OrigenDinero",
    "numero_comprobante" TEXT,
    "pago_id" INTEGER,
    "usuario_id" INTEGER NOT NULL,
    "anulado" BOOLEAN NOT NULL DEFAULT false,
    "cierre_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_caja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cierres_caja" (
    "id" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "total_ingresos" DECIMAL(10,2) NOT NULL,
    "total_egresos" DECIMAL(10,2) NOT NULL,
    "resultado_neto" DECIMAL(10,2) NOT NULL,
    "saldo_caja_operativa" DECIMAL(10,2) NOT NULL,
    "saldo_efectivo_guardado" DECIMAL(10,2) NOT NULL,
    "saldo_digital" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cierres_caja_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "socios_documento_key" ON "socios"("documento");

-- CreateIndex
CREATE INDEX "ingresos_socio_id_idx" ON "ingresos"("socio_id");

-- CreateIndex
CREATE INDEX "ingresos_fecha_hora_idx" ON "ingresos"("fecha_hora");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_numero_comprobante_key" ON "pagos"("numero_comprobante");

-- CreateIndex
CREATE INDEX "pagos_socio_id_idx" ON "pagos"("socio_id");

-- CreateIndex
CREATE INDEX "pagos_fecha_pago_idx" ON "pagos"("fecha_pago");

-- CreateIndex
CREATE UNIQUE INDEX "movimientos_caja_pago_id_key" ON "movimientos_caja"("pago_id");

-- CreateIndex
CREATE INDEX "movimientos_caja_fecha_idx" ON "movimientos_caja"("fecha");

-- CreateIndex
CREATE INDEX "movimientos_caja_tipo_idx" ON "movimientos_caja"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "cierres_caja_fecha_key" ON "cierres_caja"("fecha");

-- AddForeignKey
ALTER TABLE "socios" ADD CONSTRAINT "socios_creado_por_id_fkey" FOREIGN KEY ("creado_por_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingresos" ADD CONSTRAINT "ingresos_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingresos" ADD CONSTRAINT "ingresos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_socio_id_fkey" FOREIGN KEY ("socio_id") REFERENCES "socios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_caja" ADD CONSTRAINT "movimientos_caja_pago_id_fkey" FOREIGN KEY ("pago_id") REFERENCES "pagos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_caja" ADD CONSTRAINT "movimientos_caja_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_caja" ADD CONSTRAINT "movimientos_caja_cierre_id_fkey" FOREIGN KEY ("cierre_id") REFERENCES "cierres_caja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cierres_caja" ADD CONSTRAINT "cierres_caja_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
