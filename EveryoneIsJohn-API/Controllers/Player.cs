using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EveryoneIsJohn_API.Controllers
{
    [Route("api/player")]
    [ApiController]
    public class Player : ControllerBase
    {
        #region Methods

        [HttpGet("")]
        public IActionResult GetPlayer()
        {
            if (Authentication.CheckAuth(Request, out var user))
            {
                if (John.FindJohn(Request, out var john))
                {
                    if (john.GetPlayer(user, out var player))
                    {
                        return new JsonResult(player);
                    }
                    return Problem("Not A Player", statusCode: 401);
                }
                return Problem("No Attached John", statusCode: 400);
            }
            return Problem("No login", statusCode: 401);
        }

        #endregion Methods
    }
}