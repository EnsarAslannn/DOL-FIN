using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace api.Validation
{
    public static class ValidationProblemFactory
    {
        // Shared by ValidationActionFilter (the normal path -- a validator
        // rejects a request before the action runs) and ExceptionMiddleware
        // (defense in depth, in case a validator is ever invoked manually
        // deeper in the call stack via ValidateAndThrow) so both paths return
        // the exact same error shape.
        public static ValidationProblemDetails Create(IEnumerable<ValidationFailure> failures)
        {
            var modelState = new ModelStateDictionary();
            foreach (var failure in failures)
            {
                modelState.AddModelError(failure.PropertyName, failure.ErrorMessage);
            }

            return new ValidationProblemDetails(modelState) { Status = StatusCodes.Status400BadRequest };
        }
    }
}
