-- CreateIndex
CREATE INDEX `tasks_due_date_idx` ON `tasks`(`due_date` DESC);

-- CreateIndex
CREATE INDEX `tasks_name_idx` ON `tasks`(`name`);
