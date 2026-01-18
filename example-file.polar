is_odd(3);
is_odd("hello");
is_odd(true);
is_odd(false);
is_odd() if 10 > 5; 
is_even(n) if not is_odd(n);
is_even("Foo");
is_even("Foo") if x matches Repository and is_accessible(x) and x in [1,2,3];

resource Repository {
  permissions = ["read", "write", "delete"];
  roles = ["admin", "member", "guest"];

  relations = { "type": Foo };

  "write" if global "foo";
}

global {
  "is_accessible" if x in [1, 2, 3];
}

test "foo" {
  setup {
    fixture user_exists;
    fixture user_is_admin;

    has_membership("foo");
  }

  assert is_odd(5);
  assert is_even(6);
  assert_not is_even(7);
}

