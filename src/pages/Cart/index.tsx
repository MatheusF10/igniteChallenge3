import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
} from 'react-icons/md';
import { useCart } from '../../hooks/useCart';

import { formatPrice } from '../../util/format';

// import { useCart } from '../../hooks/useCart';
// import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

const Cart = (): JSX.Element => {
  const { cart, removeProduct, updateProductAmount } = useCart();

  const cartFormatted = cart.map((product, i): Product => {
    return {
      amount: cart.filter((p) => p.id === product.id).length,
      id: product.id,
      image: product.image,
      price: product.price,
      title: product.title,
    };
  });

  console.log(cartFormatted);
  const total = formatPrice(
    cart.reduce((sumTotal, product) => {
      return sumTotal + product.price;
    }, 0)
  );

  const setProduct = new Set();
  const filteredCart = cartFormatted.filter((p) => {
    const multipleItens = setProduct.has(p.id);
    setProduct.add(p.id);

    return !multipleItens;
  });

  function handleProductIncrement(product: Product) {
    updateProductAmount({
      productId: product.id,
      amount: product.amount,
    });
  }

  function handleProductDecrement(product: Product) {
    removeProduct(product.id, true);
  }

  function handleRemoveProduct(productId: number) {
    removeProduct(productId);
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {filteredCart.map((p) => (
            <tr data-testid="product">
              <td>
                <img src={p.image} alt="Tênis de Caminhada Leve Confortável" />
              </td>
              <td>
                <strong>{p.title}</strong>
                <span>{`R$ ${p.price}`}</span>
              </td>
              <td>
                <div>
                  <button
                    type="button"
                    data-testid="decrement-product"
                    disabled={p.amount <= 1}
                    onClick={() => handleProductDecrement(p)}
                  >
                    <MdRemoveCircleOutline size={20} />
                  </button>
                  <input
                    type="text"
                    data-testid="product-amount"
                    readOnly
                    value={p.amount}
                  />
                  <button
                    type="button"
                    data-testid="increment-product"
                    onClick={() => handleProductIncrement(p)}
                  >
                    <MdAddCircleOutline size={20} />
                  </button>
                </div>
              </td>
              <td>
                <strong>{formatPrice(p.price * p.amount)}</strong>
              </td>
              <td>
                <button
                  type="button"
                  data-testid="remove-product"
                  onClick={() => handleRemoveProduct(p.id)}
                >
                  <MdDelete size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
