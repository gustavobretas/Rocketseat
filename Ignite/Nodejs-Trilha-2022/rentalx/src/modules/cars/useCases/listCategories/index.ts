import { categoriesRepository } from '..';

import { ListCategoryController } from './ListCategoriesController';
import { ListCategoryUseCase } from './ListCategoriesUseCase';

const listCategoryUseCase = new ListCategoryUseCase(categoriesRepository);
const listCategoryController = new ListCategoryController(listCategoryUseCase);

export { listCategoryController };
