PASSWORD='Password1!'
SERVER='::1'
TEST_DIR="./tests"

for test_file in "$TEST_DIR"/*.sql; do
  test_name=$(basename "$test_file")

  # Run test
  if sqlcmd -S "$SERVER" -d supermarket -C -U sa -P "$PASSWORD" -b -i "$test_file" > /tmp/sql_test_output 2>&1; then
    echo "_/ PASS: $test_name"
  else
    echo " X FAIL: $test_name"
    sed 's/^/      /' /tmp/sql_test_output | tail -n 10   # show last few lines of output
  fi

  echo
done