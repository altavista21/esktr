CREATE TYPE "InstitutionType" AS ENUM ('PONDOK_PESANTREN', 'MADRASAH_DINIYAH', 'TPQ');
CREATE TYPE "MembershipRole" AS ENUM ('OWNER', 'OPERATOR');
CREATE TYPE "UserRole" AS ENUM ('APPLICANT', 'OFFICER', 'APPROVER', 'ADMIN');
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'NEEDS_REVISION', 'APPROVED', 'REJECTED', 'ISSUED');

CREATE TABLE "user_profiles" (
  "id" UUID NOT NULL,
  "auth_user_id" UUID NOT NULL,
  "full_name" VARCHAR(160),
  "phone" VARCHAR(32),
  "role" "UserRole" NOT NULL DEFAULT 'APPLICANT',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "institutions" (
  "id" UUID NOT NULL,
  "name" VARCHAR(200) NOT NULL,
  "type" "InstitutionType" NOT NULL,
  "registration_number" VARCHAR(80),
  "address" TEXT,
  "village" VARCHAR(120),
  "district" VARCHAR(120),
  "regency" VARCHAR(120) NOT NULL DEFAULT 'Kabupaten Temanggung',
  "province" VARCHAR(120) NOT NULL DEFAULT 'Jawa Tengah',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "institution_members" (
  "id" UUID NOT NULL,
  "user_profile_id" UUID NOT NULL,
  "institution_id" UUID NOT NULL,
  "role" "MembershipRole" NOT NULL DEFAULT 'OPERATOR',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "institution_members_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "applications" (
  "id" UUID NOT NULL,
  "institution_id" UUID NOT NULL,
  "reference_code" VARCHAR(80),
  "service_type" VARCHAR(80) NOT NULL,
  "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',
  "applicant_note" TEXT,
  "submitted_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "application_documents" (
  "id" UUID NOT NULL,
  "application_id" UUID NOT NULL,
  "document_type" VARCHAR(100) NOT NULL,
  "storage_path" VARCHAR(500) NOT NULL,
  "original_name" VARCHAR(255) NOT NULL,
  "mime_type" VARCHAR(120) NOT NULL,
  "size_bytes" BIGINT NOT NULL,
  "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "application_documents_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "verifications" (
  "id" UUID NOT NULL,
  "application_id" UUID NOT NULL,
  "officer_id" UUID NOT NULL,
  "result" VARCHAR(40) NOT NULL,
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "verifications_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "decisions" (
  "id" UUID NOT NULL,
  "application_id" UUID NOT NULL,
  "approver_id" UUID NOT NULL,
  "result" VARCHAR(20) NOT NULL,
  "notes" TEXT,
  "decided_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "decisions_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "issued_documents" (
  "id" UUID NOT NULL,
  "application_id" UUID NOT NULL,
  "issuer_id" UUID NOT NULL,
  "document_number" VARCHAR(120) NOT NULL,
  "storage_path" VARCHAR(500) NOT NULL,
  "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "issued_documents_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "audit_logs" (
  "id" UUID NOT NULL,
  "actor_auth_id" UUID,
  "action" VARCHAR(100) NOT NULL,
  "entity_type" VARCHAR(100) NOT NULL,
  "entity_id" VARCHAR(100),
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_profiles_auth_user_id_key" ON "user_profiles"("auth_user_id");
CREATE UNIQUE INDEX "institutions_registration_number_key" ON "institutions"("registration_number");
CREATE INDEX "institutions_name_idx" ON "institutions"("name");
CREATE UNIQUE INDEX "institution_members_user_profile_id_institution_id_key" ON "institution_members"("user_profile_id", "institution_id");
CREATE INDEX "institution_members_institution_id_idx" ON "institution_members"("institution_id");
CREATE UNIQUE INDEX "applications_reference_code_key" ON "applications"("reference_code");
CREATE INDEX "applications_institution_id_status_idx" ON "applications"("institution_id", "status");
CREATE INDEX "applications_created_at_idx" ON "applications"("created_at");
CREATE UNIQUE INDEX "application_documents_storage_path_key" ON "application_documents"("storage_path");
CREATE INDEX "application_documents_application_id_idx" ON "application_documents"("application_id");
CREATE INDEX "verifications_application_id_created_at_idx" ON "verifications"("application_id", "created_at");
CREATE UNIQUE INDEX "decisions_application_id_key" ON "decisions"("application_id");
CREATE UNIQUE INDEX "issued_documents_application_id_key" ON "issued_documents"("application_id");
CREATE UNIQUE INDEX "issued_documents_storage_path_key" ON "issued_documents"("storage_path");
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");
CREATE INDEX "audit_logs_actor_auth_id_created_at_idx" ON "audit_logs"("actor_auth_id", "created_at");

ALTER TABLE "institution_members" ADD CONSTRAINT "institution_members_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "institution_members" ADD CONSTRAINT "institution_members_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "applications" ADD CONSTRAINT "applications_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_officer_id_fkey" FOREIGN KEY ("officer_id") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_approver_id_fkey" FOREIGN KEY ("approver_id") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "issued_documents" ADD CONSTRAINT "issued_documents_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "issued_documents" ADD CONSTRAINT "issued_documents_issuer_id_fkey" FOREIGN KEY ("issuer_id") REFERENCES "user_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
