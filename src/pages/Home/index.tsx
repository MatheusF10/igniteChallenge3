import { useEffect, useState } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { useCart } from '../../hooks/useCart';
import { api } from '../../services/api';

import { ProductList } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface FormattedProduct extends Product {
  amount: number;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

// interface CartItemsAmount {
//   [key: number]: number;
// }

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = products.map((p): FormattedProduct => {
    return {
      id: p.id,
      amount: cart.filter((pr) => pr.id === p.id).length,
      image: p.image,
      price: p.price,
      title: p.title,
    };
  });

  useEffect(() => {
    async function loadProducts() {
      api.get('/products').then((res) => setProducts(res.data));
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number, amount: number) {
    addProduct(id, amount);
  }

  return (
    <ProductList>
      {cartItemsAmount.map((p) => (
        <li>
          <img src={p.image} alt="Tênis de Caminhada Leve Confortável" />
          <strong>{p.title}</strong>
          <span>{`R$ ${p.price}`}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(p.id, p.amount)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {p.amount}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
