-- ARRANGE
SET NOCOUNT ON;

DECLARE @CustomerId UNIQUEIDENTIFIER = NEWID()
DECLARE @MilkId INT
DECLARE @BreadId INT
DECLARE @ProductId INT

SELECT @MilkId = p.Id FROM dbo.Product p WHERE p.[Name] = 'Milk'
SELECT @BreadId = p.Id FROM dbo.Product p WHERE p.[Name] = 'Bread'

DECLARE @actual NVARCHAR(MAX), @expected NVARCHAR(MAX)
CREATE TABLE #result ( x NVARCHAR(MAX) )

:r ./fixtures/_begin_test.sql

-- ACT
SET @ProductId = @MilkId
:r ./DML/scan_product.sql

SET @ProductId = @BreadId
:r ./DML/scan_product.sql

INSERT INTO #result
:r ./DML/generate_receipt.sql

-- ASSERT
SELECT @actual = STRING_AGG(x, '\n') FROM #result
SELECT @expected = '%1) Bread.%2) Milk.%'
:r ./fixtures/assert_actual_like_expected.sql

:r ./fixtures/_end_test.sql