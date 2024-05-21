use bookbazar;

create table usuario(
CPF_Usuario char(11) not null,
Nome varchar(255) not null,
Data_nascimento date not null,
Telefone char(13) not null,
Email varchar(255) not null,
CEP char (8) not null,
primary key(CPF_Usuario)
);

create table anuncio(
ID_Anuncio int not null auto_increment,
Titulo varchar(255) not null,
Autor varchar(255) not null,
Editora varchar(255) not null,
Edicao int not null,
Genero varchar(255) not null,
Idioma varchar(255) not null,
CPF_Vendedor char(11) not null,
Valor decimal not null,
Cidade varchar(255) not null,
CEP_Anuncio char (8) not null,
Latitude decimal not null,
Longitude decimal not null,
Descricao varchar(1024) not null,
Ano_Impressao int not null,
Condicao varchar(255) not null,
primary key (ID_Anuncio),
foreign key (CPF_Vendedor) references usuario (CPF_Usuario)
);

create table transacao(
ID_Transacao int not null auto_increment,
CPF_Comprador char(11) not null,
CPF_Vendedor char (11) not null,
ID_Anuncio int not null,
primary key (ID_Transacao),
foreign key (CPF_Comprador) references usuario (CPF_Usuario),
foreign key (CPF_Vendedor) references usuario(CPF_Usuario),
foreign key (ID_Anuncio) references anuncio (ID_Anuncio)
);

create table avaliacao(
ID_Avaliacao int not null auto_increment,
Usuario_Avaliado char(11) not null,
Avaliador char(11) not null,
Estrelas_Produto int not null,
Estrelas_Vendedor int not null,
Comentario text,
primary key (ID_Avaliacao),
foreign key (Usuario_Avaliado) references usuario (CPF_Usuario),
foreign key (Avaliador) references usuario (CPF_Usuario)
);

create table comentario(
ID_Comentario int not null auto_increment,
ID_Anuncio int not null,
Autor char(11) not null,
Texto varchar(1024) not null,
primary key(ID_Comentario),
foreign key (ID_Anuncio) references anuncio (ID_Anuncio)
);