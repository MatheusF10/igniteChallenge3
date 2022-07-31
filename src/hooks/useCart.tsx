import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number, amount: number) => Promise<void>;
  removeProduct: (productId: number, decrement?: boolean) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart');

    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  //const [stock, setStock] = useState<Stock[]>([]);

  useEffect(() => {
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
  }, [cart]);

  const addProduct = async (productId: number, amount: number) => {
    try {
      const response = await api.get('/products');

      const products = response.data;

      const productToAdd = products.find((p: Product) => p.id === productId);

      const stockResponse = await api.get('/stock');

      const stock = stockResponse.data;

      const stockToCheck = stock.find((s: Stock) => s.id === productId);
      console.log('STOCK TO CHECK', { stock, stockToCheck, productToAdd });

      if (amount < stockToCheck.amount) {
        setCart([...cart, productToAdd]);
      } else {
        toast.error('Quantidade solicitada fora de estoque');
      }
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number, decrement?: boolean) => {
    const index = cart.findIndex((p) => p.id === productId);

    try {
      if (decrement) {
        const decrementedArray = cart.filter((p, i) => i !== index);
        setCart([...decrementedArray]);
      } else {
        const updatedArray = cart.filter((p) => p.id !== productId);
        setCart([...updatedArray]);
      }
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    const response = await api.get('/products');

    const products = response.data;

    const productToAdd = products.find((p: Product) => p.id === productId);

    const stockResponse = await api.get('/stock');

    const stock = stockResponse.data;

    const stockToCheck = stock.find((s: Stock) => s.id === productId);
    console.log('STOCK TO CHECK', { stock, stockToCheck, productToAdd });
    try {
      if (amount < stockToCheck.amount) {
        setCart([...cart, productToAdd]);
      } else {
        toast.error('Quantidade solicitada fora de estoque');
      }
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
