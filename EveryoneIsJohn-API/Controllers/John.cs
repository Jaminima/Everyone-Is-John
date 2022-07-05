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

        [HttpGet("{id}")]
        public IActionResult GetJohn(string id)
        {
            if (int.TryParse(id, out int Id))
            {
                if (Authentication.CheckAuth(Request, out var user))
                {
                    if (Data.Stores.johnStore.Get(Id, out var john))
                    {
                        return new JsonResult(new { john = john, players = john.scores.Select(x => x.User).ToArray() });
                    }
                    return Problem("Cannot Find John", statusCode: 400);
                }
                return Problem("No Login", statusCode: 401);
            }
            return Problem("No Provided John Id", statusCode: 400);
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
                        if (john.Creator != user.Identifier)
                        {
                            if (!john.pendingPlayers.Contains(user.Identifier) || !john.scores.Any(x => x.User == user.Identifier))
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
            return Problem("No Povided John Id", statusCode: 400);
        }

        [HttpPost("players")]
        public IActionResult ManagePlayers([FromQuery] string johnid, [FromQuery] string player, [FromQuery] bool accept = false, [FromQuery] bool kick = false)
        {
            if (int.TryParse(player, out int playerId) && int.TryParse(johnid, out int johnId))
            {
                if (Authentication.CheckAuth(Request, out var user))
                {
                    if (Data.Stores.johnStore.Get(johnId, out var john))
                    {
                        if (john.Creator == user.Identifier)
                        {
                            if (accept)
                            {
                                if (john.pendingPlayers.Remove(playerId))
                                {
                                    john.scores.Add(new Data.Objects.Score(playerId));
                                    return Ok();
                                }
                                return Problem("This person doesnt want to join", statusCode: 400);
                            }
                            else if (kick)
                            {
                                john.pendingPlayers.Remove(playerId);
                                return Ok();
                            }
                        }
                        return Problem("This is not your John", statusCode: 401);
                    }
                    return Problem("Cannot find John", statusCode: 400);
                }
                return Problem("No login", statusCode: 401);
            }
            return Problem("No povided John Id", statusCode: 400);
        }

        #endregion Methods
    }
}