using api.Dtos.Portfolio;
using FluentValidation;

namespace api.Validation
{
    public class TradeRequestDtoValidator : AbstractValidator<TradeRequestDto>
    {
        public TradeRequestDtoValidator()
        {
            RuleFor(x => x.Symbol).NotEmpty().WithMessage("Symbol is required");

            RuleFor(x => x.Quantity).GreaterThan(0).WithMessage("Quantity must be greater than 0");
        }
    }
}
