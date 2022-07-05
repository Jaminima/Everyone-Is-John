using Microsoft.AspNetCore.Mvc;

namespace EveryoneIsJohn_API.Controllers
{
    [Route("api/john")]
    [ApiController]
    public class John : Controller
    {
        #region Fields

        private static Random rnd = new Random((int)DateTime.Now.Ticks);

        #endregion Fields

        #region Methods

        [HttpGet("new")]
        public IActionResult CreateJohn([FromQuery] string johnsName = "John")
        {
            if (Authentication.CheckAuth(Request, out var user))
            {
                var john = new Data.Objects.John(user, johnsName);
                while (!Data.Stores.johnStore.Add(rnd.Next(), john)) { }
                return new JsonResult(john);
            }
            return Problem("No Login", statusCode: 401);
        }

        #endregion Methods
    }
}