function SignUp() {
  return (
    <form action="http://localhost:3000/api/v1/auth/signup" method="post">
      <label htmlFor="username">
        Username
        <input type="text" name="username" id="username" />
      </label>
      <label htmlFor="email">
        Email
        <input type="text" id="email" name="email" />
      </label>
      <label htmlFor="password">
        Password
        <input type="password" id="password" name="password" />
      </label>
      <button type="submit">Sign up</button>
    </form>
  );
}
export default SignUp;
