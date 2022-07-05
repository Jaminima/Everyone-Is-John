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

        [HttpPost("score/{idx}")]
        public IActionResult ScoreMission(string idx, [FromQuery] bool decrement = false)
        {
            if (int.TryParse(idx, out int Idx) && Idx >= 0 && Idx <= 4)
            {
                if (Authentication.CheckAuth(Request, out var user))
                {
                    if (John.FindJohn(Request, out var john))
                    {
                        if (john.GetPlayer(user, out var player))
                        {
                            if (user.Identifier == john.Creator)
                            {
                                player.missions[Idx].acheived += decrement ? -1 : 1;
                            }
                            else
                            {
                                player.missions[Idx].suggestedAcheived += decrement ? -1 : 1;
                            }
                            return new JsonResult(player);
                        }
                        return Problem("You are not a Player", statusCode: 401);
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
                                if (mission.idx >= 0 && mission.idx <= 3 && mission.level >= 0 && mission.level <= 2)
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