

function ProductCard(props) {
    const { image, itemId,sku, name, description, price } = props;

    return (
        <article className="product-card">
            <img src={image} alt={`Imagen de ${name}`} className="product-image" />
            <section className="product-content">
                <header>
                    <h2 className="product-title">{name}</h2>
                </header>
                <p className="product-code">Código: {itemId}</p>                
                <p className="product-sku">SKU: {sku}</p>
                <p className="product-price">${price.toFixed(2)}</p>
                <p className="product-description">{description}</p>
            </section>
        </article>
    );
}

export default ProductCard;