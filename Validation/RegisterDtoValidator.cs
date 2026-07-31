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

            // Full password complexity (upper/lower/digit/symbol/length) is
            // enforced by Identity's UserManager.CreateAsync itself (see the
            // AddIdentity password options in Program.cs) -- duplicating that
            // policy here would just be a second place for it to drift out of
            // sync, so this only rejects an empty password early.
            RuleFor(x => x.Password).NotEmpty().WithMessage("Password is required");
        }
    }
}
