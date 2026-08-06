using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace api.Validation
{
    public static class ValidationProblemFactory
    {
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
