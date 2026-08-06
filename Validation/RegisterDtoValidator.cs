using api.Dtos.Account;
using FluentValidation;

namespace api.Validation
{
    public class RegisterDtoValidator : AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            RuleFor(x => x.Username).NotEmpty().WithMessage("Username is required");

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("Email is required")
                .EmailAddress()
                .WithMessage("Email must be a valid email address");

            RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required");
        }
    }
}
