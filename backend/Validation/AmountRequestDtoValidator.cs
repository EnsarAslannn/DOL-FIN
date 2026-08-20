using api.Dtos.Portfolio;
using FluentValidation;

namespace api.Validation
{
    public class AmountRequestDtoValidator : AbstractValidator<AmountRequestDto>
    {
        public AmountRequestDtoValidator()
        {
            RuleFor(x => x.Amount)
                .GreaterThanOrEqualTo(0.01m)
                .WithMessage("Amount must be at least 0.01");
        }
    }
}
