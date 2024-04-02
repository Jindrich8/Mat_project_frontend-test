import * as path from 'path'
import { run } from './generate_dtos.js';

const relBackendPath = path.join('..','..','Mat_project_backend-test','mat-project-laravel-test','schemas');
const dtosTargetPath = path.join('src','api','dtos');
const excludeRelSchemas = path.join('task','defs');
const schemasExtension = ".json";

run({
    schemas:relBackendPath,
    target:dtosTargetPath,
    extension:schemasExtension,
    excludeRelSchemas:excludeRelSchemas
});

