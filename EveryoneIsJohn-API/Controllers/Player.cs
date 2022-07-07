using Microsoft.AspNetCore.Mvc;

namespace EveryoneIsJohn_API.Controllers
{
    [Route("api/player")]
    [ApiController]
    public class Player : ControllerBase
    {
        #region Methods

        [HttpGet("")]
        public IActionResult GetPlayer([FromQuery] string? id = "")
        {
            if (Authentication.CheckAuth(Request, out var user))
            {
                if (John.FindJohn(Request, out var john))
                {
                    if (id != null && id.Length > 0 && int.TryParse(id, out int Id) && john.GetPlayer(Id, out var _player))
                    {
                        return new JsonResult(_player);
                    }
                    else if (john.GetPlayer(user, out var player))
                    {
                        return new JsonResult(player);
                    }
                    return Problem("Not A Player", statusCode: 401);
                }
                return Problem("No Attached John", statusCode: 400);
            }
            return Problem("No login", statusCode: 401);
        }

        [HttpPost("score/ignoresuggested/{idx}")]
        public IActionResult IgnoreSuggestedScoreMission(string idx, [FromQuery] int playerId)
        {
            if (int.TryParse(idx, out int Idx) && Idx >= 0 && Idx <= 4)
            {
                if (Authentication.CheckAuth(Request, out var user))
                {
                    if (John.FindJohn(Request, out var john))
                    {
                        if (john.isPlaying)
                        {
                            if (john.Creator == user.Identifier)
                            {
                                if (john.GetPlayer(playerId, out var _player))
                                {
                                    _player.missions[Idx].suggestedAcheived = _player.missions[Idx].acheived;
                                    return new JsonResult(_player);
                                }
                            }
                            return Problem("You are not the Johns creator", statusCode: 401);
                        }
                        return Problem("Cant perform while John isnt playing", statusCode: 406);
                    }
                    return Problem("No attached John", statusCode: 400);
                }
                return Problem("No login", statusCode: 401);
            }
            return Problem("Malformed mission index", statusCode: 400);
        }

        [HttpPost("score/{idx}")]
        public IActionResult ScoreMission(string idx, [FromQuery] int playerId, [FromQuery] bool decrement = false)
        {
            if (int.TryParse(idx, out int Idx) && Idx >= 0 && Idx <= 4)
            {
                if (Authentication.CheckAuth(Request, out var user))
                {
                    if (John.FindJohn(Request, out var john))
                    {
                        if (john.isPlaying)
                        {
                            if (john.GetPlayer(playerId, out var player))
                            {
                                var mission = player.missions[Idx];
                                if (user.Identifier == john.Creator)
                                {
                                    mission.acheived += decrement ? -1 : 1;
                                    if (mission.suggestedAcheived <= mission.acheived) mission.suggestedAcheived = mission.acheived;
                                }
                                else if (user.Identifier == player.User)
                                {
                                    mission.suggestedAcheived += decrement ? -1 : 1;
                                }
                                return new JsonResult(player);
                            }
                            return Problem("You are not a Player", statusCode: 401);
                        }
                        return Problem("Cant change while John isnt playing", statusCode: 406);
                    }
                    return Problem("No attached John", statusCode: 400);
                }
                return Problem("No login", statusCode: 401);
            }
            return Problem("Malformed mission index", statusCode: 400);
        }

        [HttpPost("missions")]
        public IActionResult UpdateMissions(Data.Objects.Player.Mission[] missions)
        {
            if (Authentication.CheckAuth(Request, out var user))
            {
                if (John.FindJohn(Request, out var john))
                {
                    if (john.GetPlayer(user, out var player))
                    {
                        if (!john.isPlaying)
                        {
                            foreach (var mission in missions)
                            {
                                if (mission.idx >= 0 && mission.idx <= 3 && mission.level >= 1 && mission.level <= 3)
                                {
                                    player.missions[mission.idx].desc = mission.desc;
                                    player.missions[mission.idx].level = mission.level;
                                }
                                else
                                {
                                    return Problem("Mission Idx or Level out of range", statusCode: 400);
                                }
                            }
                            return new JsonResult(player);
                        }
                        return Problem("Cant change while John is playing", statusCode: 406);
                    }
                    return Problem("You are not a Player", statusCode: 401);
                }
                return Problem("No attached John", statusCode: 400);
            }
            return Problem("No login", statusCode: 401);
        }

        #endregion Methods
    }
}