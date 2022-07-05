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

        public static bool FindJohn(string id, HttpRequest request, out Data.Objects.John john)
        {
            john = null;
            if (int.TryParse(id, out int Id))
            {
                if (Data.Stores.johnStore.Get(Id, out john))
                {
                    return true;
                }
            }
            return false;
        }

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

        [HttpGet("{id}")]
        public IActionResult GetJohn(string id)
        {
            if (Authentication.CheckAuth(Request, out var user))
            {
                if (FindJohn(id, Request, out var john))
                {
                    return new JsonResult(new { john = john, players = john.players.Select(x => x.User).ToArray() });
                }
                return Problem("No Provided John Id", statusCode: 400);
            }
            return Problem("No Login", statusCode: 401);
        }

        [HttpPost("join")]
        public IActionResult JoinJohn([FromQuery] string id)
        {
            if (Authentication.CheckAuth(Request, out var user))
            {
                if (FindJohn(id, Request, out var john))
                {
                    if (john.Creator != user.Identifier)
                    {
                        if (!john.pendingPlayers.Contains(user.Identifier) || !john.players.Any(x => x.User == user.Identifier))
                        {
                            john.pendingPlayers.Add(user.Identifier);
                            return new JsonResult(john);
                        }
                        return Problem("Already In John", statusCode: 409);
                    }
                    return Problem("You Already Run This John", statusCode: 409);
                }
                return Problem("Cannot Find John", statusCode: 400);
            }
            return Problem("No Login", statusCode: 401);
        }

        [HttpPost("players")]
        public IActionResult ManagePlayers([FromQuery] string johnid, [FromQuery] string player, [FromQuery] bool accept = false, [FromQuery] bool kick = false)
        {
            if (Authentication.CheckAuth(Request, out var user))
            {
                if (FindJohn(johnid, Request, out var john) && int.TryParse(player, out int playerId))
                {
                    if (john.Creator == user.Identifier)
                    {
                        if (accept)
                        {
                            if (john.pendingPlayers.Remove(playerId))
                            {
                                john.players.Add(new Data.Objects.Player(playerId));
                                return Ok();
                            }
                            return Problem("This person doesnt want to join", statusCode: 400);
                        }
                        else if (kick)
                        {
                            john.players.RemoveAll(x => x.User == playerId);
                            john.pendingPlayers.Remove(playerId);
                            return Ok();
                        }
                    }
                    return Problem("This is not your John", statusCode: 401);
                }
                return Problem("Cannot find John Or Player Id Malformed", statusCode: 400);
            }
            return Problem("No login", statusCode: 401);
        }

        #endregion Methods
    }
}
}