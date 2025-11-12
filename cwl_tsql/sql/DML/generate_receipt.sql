SELECT
    CONCAT(i, ') ', [Name], '. ', quantity, ' @ £', price, " = £", price * quantity)
FROM (
    SELECT
        p.[Name],
        p.Price,
        COUNT(1) as quantity,
        DENSE_RANK() OVER (ORDER BY p.[Name]) AS i
    FROM dbo.Basket b JOIN dbo.Product p ON b.ProductId = p.Id
    GROUP BY p.[Name], p.Price
) x