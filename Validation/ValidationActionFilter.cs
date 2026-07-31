using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace api.Validation
{
    // Registered globally (see Program.cs) instead of per-controller: for every
    // action argument that has a matching IValidator<T> registered in DI, runs
    // it before the action executes and short-circuits with a 400
    // ValidationProblemDetails on failure. This is the sole validation gate --
    // ApiBehaviorOptions.SuppressModelStateInvalidFilter is set in Program.cs so
    // the built-in DataAnnotations-driven 400 (which would otherwise win first
    // and pre-empt this with a differently-shaped response) never fires.
    public class ValidationActionFilter : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            foreach (var argument in context.ActionArguments.Values)
            {
                if (argument is null)
                {
                    continue;
                }

                var validatorType = typeof(IValidator<>).MakeGenericType(argument.GetType());
                if (
                    context.HttpContext.RequestServices.GetService(validatorType)
                    is not IValidator validator
                )
                {
                    continue;
                }

                var validationContext = new ValidationContext<object>(argument);
                var result = await validator.ValidateAsync(validationContext);

                if (!result.IsValid)
                {
                    context.Result = new BadRequestObjectResult(ValidationProblemFactory.Create(result.Errors));
                    return;
                }
            }

            await next();
        }
    }
}
