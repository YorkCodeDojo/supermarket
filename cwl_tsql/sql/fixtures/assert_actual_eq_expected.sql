IF (@actual <> @expected)
BEGIN
    PRINT FORMATMESSAGE(N'Expected: %s  Actual: %s', COALESCE(@expected, '<null>'), COALESCE(@actual, '<null>'));
    THROW 50000, @msg, 1;
END