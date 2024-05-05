import { Dimensions, PartialProduct, PieceInfo } from "../types/product";

const validateDimensions = (dimensions: Dimensions): boolean =>
  typeof dimensions === "object" &&
  dimensions !== null &&
  dimensions.height > 0 &&
  dimensions.width > 0 &&
  dimensions.depth > 0 &&
  dimensions.weight > 0;

const validatePieceInfo = (pieceInfo: PieceInfo): boolean =>
  typeof pieceInfo === "object" &&
  pieceInfo !== null &&
  typeof pieceInfo.technique === "string" &&
  pieceInfo.technique.trim() !== "" && // Ensure string is not empty after trimming
  Array.isArray(pieceInfo.materials) &&
  pieceInfo.materials.every(
    (material) => typeof material === "string" && material.trim() !== "",
  ) && // Ensure strings are not empty after trimming
  validateDimensions(pieceInfo.dimensions) &&
  typeof pieceInfo.year === "number" &&
  pieceInfo.year > 0 &&
  typeof pieceInfo.state === "string" &&
  pieceInfo.state.trim() !== ""; // Ensure string is not empty after trimming

export const validatePartialProduct = (
  partialProduct: PartialProduct,
): boolean =>
  typeof partialProduct === "object" &&
  partialProduct !== null &&
  typeof partialProduct.title === "string" &&
  partialProduct.title.trim() !== "" && // Ensure string is not empty after trimming
  typeof partialProduct.author === "string" &&
  partialProduct.author.trim() !== "" && // Ensure string is not empty after trimming
  typeof partialProduct.description === "string" &&
  partialProduct.description.trim() !== "" && // Ensure string is not empty after trimming
  typeof partialProduct.price === "number" &&
  partialProduct.price > 0 &&
  typeof partialProduct.product_type === "string" &&
  partialProduct.product_type.trim() !== "" && // Ensure string is not empty after trimming
  validatePieceInfo(partialProduct.piece_info);
