using CSharpFunctionalExtensions;
using Epam.ItMarathon.ApiService.Application.UseCases.User.Commands;
using Epam.ItMarathon.ApiService.Domain.Abstract;
using Epam.ItMarathon.ApiService.Domain.Shared.ValidationErrors;
using FluentValidation.Results;
using MediatR;
using RoomAggregate = Epam.ItMarathon.ApiService.Domain.Aggregate.Room.Room;

namespace Epam.ItMarathon.ApiService.Application.UseCases.User.Handlers
{
    /// <summary>
    /// Handler for deleting a user from a room.
    /// </summary>
    public class DeleteUserHandler(IRoomRepository roomRepository)
        : IRequestHandler<DeleteUserRequest, Result<RoomAggregate, ValidationResult>>
    {
        ///<inheritdoc/>
        public async Task<Result<RoomAggregate, ValidationResult>> Handle(DeleteUserRequest request, CancellationToken cancellationToken)
        {
            // 1. Перевірка: існує кімната за userCode
            var roomResult = await roomRepository.GetByUserCodeAsync(request.UserCode, cancellationToken);
            if (roomResult.IsFailure || roomResult.Value is null)
            {
                return Result.Failure<RoomAggregate, ValidationResult>(
                    new NotFoundError([
                        new ValidationFailure(nameof(request.UserCode), "User with provided userCode was not found.")
                    ]));
            }

            var room = roomResult.Value;

            // 2. Перевірка: чи знайдено користувача для видалення
            var userToDelete = room.Users.FirstOrDefault(u => u.Id == request.UserId);
            if (userToDelete is null)
            {
                return Result.Failure<RoomAggregate, ValidationResult>(
                    new NotFoundError([
                        new ValidationFailure(nameof(request.UserId), "User with specified id not found.")
                    ]));
            }

            // 3. Перевірка: користувач із userCode (той, хто викликає) існує
            var actingUser = room.Users.FirstOrDefault(u => u.AuthCode == request.UserCode);
            if (actingUser is null)
            {
                return Result.Failure<RoomAggregate, ValidationResult>(
                    new NotFoundError([
                        new ValidationFailure(nameof(request.UserCode), "User with this userCode not found in the room.")
                    ]));
            }

            // 4. Перевірка: користувач із userCode — адміністратор
            if (!actingUser.IsAdmin)
            {
                return Result.Failure<RoomAggregate, ValidationResult>(
                    new BadRequestError([
                        new ValidationFailure(nameof(actingUser.IsAdmin), "Only room administrator can delete users.")
                    ]));
            }

            // 5. Перевірка: користувачі належать до різних кімнат (у твоїй структурі вони всі в room.Users)
            if (!room.Users.Contains(actingUser) || !room.Users.Contains(userToDelete))
            {
                return Result.Failure<RoomAggregate, ValidationResult>(
                    new BadRequestError([
                        new ValidationFailure(nameof(request.UserId), "User and admin belong to different rooms.")
                    ]));
            }

            // 6. Перевірка: користувач не може видалити сам себе
            if (actingUser.Id == userToDelete.Id)
            {
                return Result.Failure<RoomAggregate, ValidationResult>(
                    new BadRequestError([
                        new ValidationFailure(nameof(request.UserId), "Administrator cannot delete themselves.")
                    ]));
            }

            // 7. Перевірка: кімната вже закрита
            if (room.IsClosed)
            {
                return Result.Failure<RoomAggregate, ValidationResult>(
                    new BadRequestError([
                        new ValidationFailure(nameof(room.ClosedOn), "Room is already closed.")
                    ]));
            }

            // 8. Видаляємо користувача
            var deleteResult = room.DeleteUser(request.UserId);
            if (deleteResult.IsFailure)
            {
                return Result.Failure<RoomAggregate, ValidationResult>(deleteResult.Error);
            }

            // 9. Оновлюємо кімнату в репозиторії
            var updateResult = await roomRepository.UpdateAsync(room, cancellationToken);
            if (updateResult.IsFailure)
            {
                return Result.Failure<RoomAggregate, ValidationResult>(
                    new BadRequestError([
                        new ValidationFailure(nameof(roomRepository.UpdateAsync), updateResult.Error)
                    ]));
            }

            // 10. Повертаємо оновлену кімнату
            return room;
        }
    }
}
