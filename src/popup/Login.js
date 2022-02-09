import logo from "../images/zeeguu128.png"

export default function Login() {
    return (
        <form>
            <div class="imgcontainer">
            <img src={logo} alt="Zeeguu logo" class="logo"/>
            </div>
            <div class="container">
              <label for="uname"><b>Username</b></label>
              <input type="text" placeholder="Enter Username" name="uname" required/>
              <label for="psw"><b>Password</b></label>
              <input type="password" placeholder="Enter Password" name="psw" required/>
              <button type="submit">Login</button>
            </div>
      </form>
    )}