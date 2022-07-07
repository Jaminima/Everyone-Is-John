using Microsoft.AspNetCore.Mvc;
using Scrypt;

namespace EveryoneIsJohn_API.Controllers
{
    [Route("api/authentication")]
    [ApiController]
    public class Authentication : ControllerBase
    {
        #region Fields

        private static ScryptEncoder encoder = new ScryptEncoder();
        private static string[] randomNames = new string[] { "Jahn", "Mortha", "Plopper", "Biggus Dickus" };
        private static Random rnd = new Random((int)DateTime.Now.Ticks);

        #endregion Fields

        #region Methods

        private static string rndString(int length = 32)
        {
            string s = "";
            while (length > 0)
            {
                s += (char)rnd.Next(65, 91);
                length--;
            }
            return s;
        }

        public static bool CheckAuth(HttpRequest request, out Data.Objects.User userOut)
        {
            userOut = null;

            string? id;
            string? key = "";
            Microsoft.Extensions.Primitives.StringValues _id = "", _key = "";
            if ((request.Cookies.TryGetValue("id", out id) && request.Cookies.TryGetValue("key", out key)) || (request.Headers.TryGetValue("id", out _id) && request.Headers.TryGetValue("key", out _key)))
            {
                if (_id.Count > 0) id = _id.ToString();
                if (_key.Count > 0) key = _key.ToString();

                if (int.TryParse(id, out int Id) && Data.Stores.userStore.Get(Id, out var user))
                {
                    if (encoder.Compare(key, user.Key))
                    {
                        userOut = user;
                        return true;
                    }
                }
            }
            return false;
        }

        [HttpGet("check")]
        public IActionResult Check()
        {
            if (CheckAuth(Request, out var user))
            {
                return new JsonResult(user);
            }
            return Problem("No Login", statusCode: 401);
        }

        [HttpPost("new")]
        public IActionResult NewUser([FromQuery] string? name)
        {
            string key = rndString();
            var user = new Data.Objects.User(encoder.Encode(key), name != null && name.Length > 0 ? name : randomNames[rnd.Next(0, randomNames.Length)]);
            user = Data.Stores.userStore.Append(user);

            Response.Cookies.Append("id", user.Identifier.ToString());
            Response.Cookies.Append("key", key);

            if (Request.Host.Host.Contains("localhost"))
            {
                return new JsonResult(new { id = user.Identifier, key = key, user = user });
            }

            return new JsonResult(new { user = user });
        }

        [HttpPost("update")]
        public IActionResult UpdateUser(string? name)
        {
            if (CheckAuth(Request, out var user))
            {
                if (name != null && name.Length > 0) user.Name = name;
                return new JsonResult(user);
            }
            return Problem("No Login", statusCode: 401);
        }

        #endregion Methods
    }
}