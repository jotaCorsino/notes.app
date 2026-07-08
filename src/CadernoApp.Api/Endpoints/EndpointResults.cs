using CadernoApp.Api.Contracts;

namespace CadernoApp.Api.Endpoints;

internal static class EndpointResults
{
    public static IResult FromException(Exception exception)
    {
        return exception switch
        {
            KeyNotFoundException => Results.NotFound(new ErrorResponse(exception.Message)),
            ArgumentException => Results.BadRequest(new ErrorResponse(exception.Message)),
            InvalidOperationException => Results.BadRequest(new ErrorResponse(exception.Message)),
            _ => Results.Problem("An unexpected error occurred.")
        };
    }
}
