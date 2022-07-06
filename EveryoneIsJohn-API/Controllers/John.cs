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

        public static bool FindJohn(HttpRequest request, out Data.Objects.John john, string id = "")
        {
            if (id == null || id.Length == 0)
            {
                if (request.Cookies.TryGetValue("johnId", out string johnid)) id = johnid;
                if (request.Headers.TryGetValue("johnId", out var jid)) id = jid.ToString();
            }

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
        public IActionResult CreateJohn([FromQuery] string? johnsName = "John")
        {
            if (Authentication.CheckAuth(Request, out var user))
            {
                var john = new Data.Objects.John(user, johnsName);
                while (!Data.Stores.johnStore.Add(rnd.Next(), john)) { }
                Response.Cookies.Append("johnId", john.Identifier.ToString());
                return new JsonResult(john);
            }
            return Problem("No Login", statusCode: 401);
        }

        [HttpGet("")]
        public IActionResult GetJohn()
        {
            return GetJohn("");
        }

        [HttpGet("{id}")]
        public IActionResult GetJohn(string id)
        {
            if (Authentication.CheckAuth(Request, out var user))
            {
                if (FindJohn(Request, out var john, id))
                {
                    Response.Cookies.Append("johnId", john.Identifier.ToString());
                    var plers = john.players.Select(x => x.User).ToArray();
                    var plersNames = plers.Select(x =>
                    {
                        if (Data.Stores.userStore.Get(x, out var u))
                        {
                            return u.Name;
                        }
                        return "Id - " + u.Identifier;
                    });
                    var pendingPlayers = john.pendingPlayers.Select(x =>
                    {
                        if (Data.Stores.userStore.Get(x, out var u))
                        {
                            return u.Name;
                        }
                        return "Id - " + u.Identifier;
                    });
                    return new JsonResult(new { john = john, players = plers, playersNames = plersNames, pendingPlayersNames = pendingPlayers, fullPlayers = user.Identifier == john.Creator ? john.players : null });
                }
                return Problem("No Provided John Id", statusCode: 400);
            }
            return Problem("No Login", statusCode: 401);
        }

        [HttpPost("join/{id}")]
        public IActionResult JoinJohn(string id)
        {
            if (Authentication.CheckAuth(Request, out var user))
            {
                if (FindJohn(Request, out var john, id))
                {
                    if (john.Creator != user.Identifier)
                    {
                        if (!john.pendingPlayers.Contains(user.Identifier) && !john.players.Any(x => x.User == user.Identifier))
                        {
                            john.pendingPlayers.Add(user.Identifier);
                            Response.Cookies.Append("johnId", john.Identifier.ToString());
                        }
                        return new JsonResult(john);
                    }
                    return Problem("You Run This John", statusCode: 409);
                }
                return Problem("Cannot Find John", statusCode: 400);
            }
            return Problem("No Login", statusCode: 401);
        }

        [HttpPost("leave")]
        public IActionResult LeaveJohn()
        {
            if (Authentication.CheckAuth(Request, out var user))
            {
                if (FindJohn(Request, out var john))
                {
                    if (john.Creator != user.Identifier)
                    {
                        john.pendingPlayers.Remove(user.Identifier);
                        john.players.RemoveAll(x => x.User == user.Identifier);
                    }
                    else
                    {
                        Data.Stores.johnStore.Remove(john.Identifier);
                    }
                    return Ok();
                }
                return Problem("Cannot Find John", statusCode: 400);
            }
            return Problem("No Login", statusCode: 401);
        }

        [HttpPost("players")]
        public IActionResult ManagePlayers([FromQuery] string player, [FromQuery] bool accept = false, [FromQuery] bool kick = false)
        {
            if (Authentication.CheckAuth(Request, out var user))
            {
                Data.Objects.John john;
                if (FindJohn(Request, out john) && int.TryParse(player, out int playerId))
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

        [HttpPost("start")]
        public IActionResult StartJohn()
        {
            if (Authentication.CheckAuth(Request, out var user))
            {
                if (FindJohn(Request, out var john))
                {
                    if (john.Creator == user.Identifier || true)
                    {
                        foreach (var player in john.players)
                        {
                            if (!player.missions.Any(x => x.level == 0) || !player.missions.Any(x => x.level == 1) || !player.missions.Any(x => x.level == 2))
                            {
                                return Problem($"{player.User} Is Missing A Mission For A Certain Level", statusCode: 428);
                            }
                        }
                        john.isPlaying = true;
                        return Ok();
                    }
                    return Problem("This is not your John", statusCode: 401);
                }
                return Problem("No Provided John Id", statusCode: 400);
            }
            return Problem("No Login", statusCode: 401);
        }

        #endregion Methods
    }
}