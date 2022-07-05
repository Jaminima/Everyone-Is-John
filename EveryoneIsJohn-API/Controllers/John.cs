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

        [HttpPost("new")]
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

        [HttpPost("join")]
        public IActionResult JoinJohn([FromQuery] string id)
        {
            if (int.TryParse(id, out int Id))
            {
                if (Authentication.CheckAuth(Request, out var user))
                {
                    if (Data.Stores.johnStore.Get(Id, out var john))
                    {
                        if (!john.pendingPlayers.Contains(user.Identifier) || !john.scores.Any(x => x.User == user.Identifier))
                        {
                            john.pendingPlayers.Add(user.Identifier);
                            return new JsonResult(john);
                        }
                        return Problem("Already In John", statusCode: 409);
                    }
                    return Problem("Cannot Find John", statusCode: 400);
                }
                return Problem("No Login", statusCode: 401);
            }
            return Problem("No Povided John Id", statusCode: 400);
        }

        #endregion Methods
    }
}