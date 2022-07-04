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
        private static Random rnd = new Random();

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

        [HttpGet("check")]
        public IActionResult Check()
        {
            if (Request.Cookies.TryGetValue("id", out string? id) && Request.Cookies.TryGetValue("key", out string? key))
            {
                if (int.TryParse(id, out int Id) && Data.Stores.userStore.Get(Id, out var user))
                {
                    return new JsonResult(user);
                }
                return Problem("You Have No Login", statusCode: 401);
            }
            return Problem("You Have No Login", statusCode: 401);
        }

        [HttpGet("new")]
        public IActionResult NewUser([FromQuery] string? name)
        {
            string key = rndString();
            var user = new Data.Objects.User(encoder.Encode(key), name != null && name.Length > 0 ? name : randomNames[rnd.Next(0, randomNames.Length)]);
            user = Data.Stores.userStore.Append(user);

            Response.Cookies.Append("id", user.Identifier.ToString());
            Response.Cookies.Append("key", user.Key);
            return new JsonResult(user);
        }

        #endregion Methods
    }
}