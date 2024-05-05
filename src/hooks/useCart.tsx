import { useContext } from "react";
import CartContext, { UseCartContextType } from "../contexts/cartProvider";

const useCart = (): UseCartContextType => useContext(CartContext);

export default useCart;
