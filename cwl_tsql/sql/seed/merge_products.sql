DECLARE @SummaryOfChanges TABLE (Change VARCHAR(20))
;

MERGE INTO
    dbo.Product AS tgt
USING
    (VALUES
        ('Milk', 1.5),
        ('Bread', 3.5)
    ) AS src([Name], Price)
ON tgt.[Name] = src.[Name]
WHEN MATCHED THEN
    UPDATE SET Price = src.Price
WHEN NOT MATCHED BY TARGET THEN
    INSERT ([Name], Price)
    VALUES (src.[Name], src.Price)
OUTPUT $action
INTO @SummaryOfChanges
;

SELECT      Change, COUNT(*) as ChangeCount
FROM        @SummaryOfChanges
GROUP BY    Change
;
