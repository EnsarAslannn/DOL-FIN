using api.Dtos.Alerts;
using FluentValidation;

namespace api.Validation
{
    public class CreatePriceAlertRequestDtoValidator : AbstractValidator<CreatePriceAlertRequestDto>
    {
        public CreatePriceAlertRequestDtoValidator()
        {
            RuleFor(x => x.StockId).GreaterThan(0).WithMessage("StockId must reference a valid stock");

            RuleFor(x => x.TargetPrice).GreaterThan(0).WithMessage("Target price must be greater than 0");

            RuleFor(x => x.Condition)
                .IsInEnum()
                .WithMessage("Condition must be GreaterThanOrEqual or LessThanOrEqual");
        }
    }
}
