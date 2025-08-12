-- Base de datos biblioteca version easy
DROP DATABASE IF EXISTS biblioteca_easy;
CREATE DATABASE biblioteca_easy;
USE biblioteca_easy;

-- Tabla usuarios
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
  id_usuario serial PRIMARY KEY,
  nombre varchar(100) NOT NULL,
  identificacion varchar(50) NOT NULL UNIQUE,
  correo varchar(100) DEFAULT NULL,
  telefono varchar(50) DEFAULT NULL);

-- Tabla libros
DROP TABLE IF EXISTS factura;
CREATE TABLE factura (
  num_factura varchar(50) NOT NULL  PRIMARY KEY,
  fecha_factura date DEFAULT NULL,
  monto_facturado varchar(50) not null,
  monto_pagado varchar(50) not null,
  id_usuario integer not null references usuarios(id_usuario));

--make a list type enum to select a status
create type estado_transaccion as enum ('pendiente','fallido','completado');


-- Tabla prestamos
DROP TABLE IF EXISTS transaccion;
create table transaccion (                                                  
  id_transaccion varchar(50) not null primary key,
  fecha_transaccion date NOT NULL,
  monto_transaccion varchar(100) NOT NULL,
  estado estado_transaccion not null,
  id_usuario integer not null references usuarios(id_usuario),
  num_factura varchar(50) not null references factura(num_factura)
);




select * from usuarios;
select * from factura;
select * from transaccion;





