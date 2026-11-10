CREATE TABLE "app_config" (
	"chave" text PRIMARY KEY NOT NULL,
	"valor" jsonb NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tabelas_fiscais" (
	"id" serial PRIMARY KEY NOT NULL,
	"ano" integer NOT NULL,
	"versao" integer DEFAULT 1 NOT NULL,
	"ativa" boolean DEFAULT true NOT NULL,
	"payload" jsonb NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "tabelas_fiscais_ano_versao" ON "tabelas_fiscais" USING btree ("ano","versao");